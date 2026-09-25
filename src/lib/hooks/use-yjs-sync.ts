"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";
import type { Collaborator } from "@/types/document";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

export function useYjsSync(
  documentId: string,
  ydoc: Y.Doc,
  currentUser: Collaborator,
) {
  const [presentUsers, setPresentUsers] = useState<Collaborator[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");

  useEffect(() => {
    let isCancelled = false; // scoped to THIS effect run only
    const supabase = createClient();
    const topicName = `document-content-${documentId}`;

    const channel = supabase.channel(topicName, {
      config: { private: true },
    });

    channel.on("broadcast", { event: "yjs-update" }, ({ payload }) => {
      const update = Uint8Array.from(atob(payload.update as string), (c) =>
        c.charCodeAt(0),
      );
      Y.applyUpdate(ydoc, update, "remote");
    });

    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<{ user: Collaborator }>();
      const users = Object.values(state)
        .flat()
        .map((entry) => entry.user)
        .filter((user) => user.id !== currentUser.id);
      setPresentUsers(users);
    });

    function handleLocalUpdate(update: Uint8Array, origin: unknown) {
      if (origin === "remote") return;
      const base64 = btoa(String.fromCharCode(...update));

      channel.send({
        type: "broadcast",
        event: "yjs-update",
        payload: { update: base64 },
      });
    }
    ydoc.on("update", handleLocalUpdate);

    async function connect() {
      const { data } = await supabase.auth.getSession();
      if (isCancelled) return;
      if (data.session) {
        supabase.realtime.setAuth(data.session.access_token);
      }

      channel.subscribe(async (subStatus) => {
        if (isCancelled) return;

        if (subStatus === "SUBSCRIBED") {
          setStatus("connected");
          await channel.track({ user: currentUser });
        } else if (subStatus === "CLOSED" || subStatus === "CHANNEL_ERROR") {
          setStatus("disconnected");
        }
      });
    }

    connect();

    return () => {
      isCancelled = true;
      ydoc.off("update", handleLocalUpdate);
      supabase.removeChannel(channel);
    };
  }, [documentId, ydoc, currentUser]);

  return { presentUsers, status };
}
