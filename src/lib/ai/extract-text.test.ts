import { describe, it, expect } from "vitest";
import * as Y from "yjs";
import { extractTextFromYDoc } from "./extract-text";

function addElement(parent: Y.XmlFragment, nodeName: string): Y.XmlElement {
  const element = new Y.XmlElement(nodeName);
  parent.insert(parent.length, [element]);
  return element;
}

function addText(parent: Y.XmlFragment, text: string): Y.XmlText {
  const node = new Y.XmlText();
  parent.insert(parent.length, [node]);
  node.insert(0, text);
  return node;
}

describe("extractTextFromYDoc", () => {
  it("returns an empty string for an empty document", () => {
    expect(extractTextFromYDoc(new Y.Doc())).toBe("");
  });

  it("puts each paragraph on its own line", () => {
    const doc = new Y.Doc();
    const root = doc.getXmlFragment("default");
    addText(addElement(root, "paragraph"), "First");
    addText(addElement(root, "paragraph"), "Second");

    expect(extractTextFromYDoc(doc)).toBe("First\nSecond");
  });

  it("reads text nested inside lists", () => {
    const doc = new Y.Doc();
    const list = addElement(doc.getXmlFragment("default"), "bulletList");
    addText(addElement(addElement(list, "listItem"), "paragraph"), "One");
    addText(addElement(addElement(list, "listItem"), "paragraph"), "Two");

    expect(extractTextFromYDoc(doc)).toBe("One\nTwo");
  });

  it("ignores formatting such as bold", () => {
    const doc = new Y.Doc();
    const paragraph = addElement(doc.getXmlFragment("default"), "paragraph");
    const text = addText(paragraph, "Hello ");
    text.insert(6, "world", { bold: true });

    expect(extractTextFromYDoc(doc)).toBe("Hello world");
  });
});
