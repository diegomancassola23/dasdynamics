---
title: "Automating label creation in X++ (D365FO)"
description: "An open-source MCP server that creates, reuses and translates X++ labels in D365FO, driven by GitHub Copilot Chat in Visual Studio."
date: 2026-01-31
kind: article
track: ai
versions: ["D365FO"]
tags: ["labels","mcp","copilot","visual-studio","xpp"]
originalUrl: "https://www.linkedin.com/pulse/automating-label-creation-x-d365fo-diego-mancassola-j5d3f/"
mergedFrom: []
draft: false
---

I’ve just published my first MCP project on GitHub, focused on **simplifying and standardizing label management** in **Dynamics 365 Finance & Operations (X++)**. This tool is made for VS 2022 or future version but is completely compliant with Visual Studio Code.

Label creation is a small task that happens _very often_ during development—and it’s easy to waste time or introduce inconsistencies. This tool aims to make the process faster, safer, and more predictable.

## What the tool does

- Create **new labels in multiple languages**
- Use **primary proved text as the base language** for label naming and structure
- Support secondary **languages**
- Support **custom prefixes** to align with project conventions
- **Reuse existing labels automatically** when they already exist
- Option to **force the creation of a new label** when needed
- Manage **label comments** for better clarity and maintainability

The goal is to reduce manual effort while keeping label naming consistent across projects and teams.

The project is open-source and available on GitHub. Feedback and ideas from the Dynamics community are very welcome!

[https://github.com/diegomancassola23/d365fo.MCP](https://github.com/diegomancassola23/d365fo.MCP)

## Installation & Configuration

1. **Clone the repository**

2. **Add an** `.mcp.json` file and register the MCP server, for example:

```json
"d365fo.MCP": {
  "type": "stdio",
  "command": "dotnet",
  "args": [
    "run",
    "--project",
    "J:\\d365fo.MCP\\d365fo.MCP.csproj"
  ],
  "env": {}
}
```

Official Microsoft documentation on MCP servers (Visual Studio): [https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers?view=visualstudio](https://learn.microsoft.com/en-us/visualstudio/ide/mcp-servers?view=visualstudio)

3. **Configure app.config**

Set the required parameters according to your environment:

```xml
<add key="model" value="MYMODEL"/>
<add key="labelFileName" value="MYMODEL"/>
<add key="labelsModel" value="MYLABEL"/>
<add key="aosServicePath" value="J:\AosService\PackagesLocalDirectory"/>
<add key="labelPrefix" value=""/>
```

Where you can define:

- The **main model name**
- The **model for labels** (can be the same or different)
- The **PackagesLocalDirectory** local path
- An optional **label prefix** to follow project conventions

## Smart label prefix management in X++ (D365FO)

One of the most error-prone parts of label creation in **X++ / Dynamics 365 Finance & Operations** is **prefix management**: keeping names consistent, avoiding collisions, and following project conventions—especially in large teams during merge operations.

In my MCP tool, I focused heavily on making **label prefixes flexible but safe**.

**How the label prefix is handled**

The prefix is read from configuration and can include **special placeholders** to support different scenarios:

- `$$$` → **external prefix placeholder** Useful when the prefix must be provided dynamically (e.g. per feature, module, or context)
- `###` → **auto-increment placeholder** Automatically resolves the next available numeric suffix by scanning existing labels

This allows prefixes like: `TASK$$$_###`

## Making Copilot predictable with copilot-instructions.md (D365FO / X++)

When using **GitHub Copilot Chat** with **Visual Studio 2022**, the key is not just _what_ you ask—but **how Copilot understands your project rules**.

For X++ label creation in **Dynamics 365 Finance & Operations**, I’ve found that adding a simple `copilot-instructions.md` file to the solution makes a huge difference.

It’s **not mandatory**, But with instructions, Copilot’s behavior becomes **more predictable and consistent**

**How to install the instructions**

- Create a file named `copilot-instructions.md` (check example file in git)
- Add it to the **Visual Studio 2022 solution** as a **Solution Item**
- No extra configuration needed: Visual Studio automatically uses it as Copilot context

(Official docs: [https://learn.microsoft.com/en-us/visualstudio/ide/copilot-chat-context?view=visualstudio](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-chat-context?view=visualstudio))

---

### Example 1 – Explicit request

**Prompt:**

> Create a label using MCP tool “this is my label” and translate it into IT, DE, ES

---

### Example 2 – Minimal request using instructions

**Prompt:**

> Create a label “this is my label”

Same tool. Same rules. Different prompts → **same predictable outcome**

## Disclaimer

This post was generated with the support of AI. However, the content is based on **real, hands-on experience** gained in daily X++ development projects day by day over 15 years.

This solution originates as an **extracted and simplified version of an internal tool** used every day, adapted and shared to contribute back to the community.

For any questions or additional information, feel free to **reach out to me privately**.
