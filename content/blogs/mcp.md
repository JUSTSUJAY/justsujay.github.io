---
title: MCP
date: March 30, 2025
author: Sujay Kapadnis
---

This are my notes on Model Context Protocol (MCP) maintained by Apic.

- Models are as good as the context given to them.
  
# What is MCP?
- It's an open protocol that enables seamless integration between [AI apps and agents] and [tools and data sources].
  - **APIs** - Standardized way how applications interact with backend services, databases and servers.
  - **LSPs** - Standardized way how IDEs interacts with language specific tools like code navigation, intellisense, etc.
  - **MCP** - (Meant to be) standardized way how AI applications interact with external systems like prompt and other resources.

Until now the AI develompment has been very fragamented as everything was written from scratch. The prompts, the function calling, data fetching. Every implementation was unique in it's own way.
With MCPs in the picture, we will have a proper client-server structure, with MCP clients being Claude Desktop, Cursor, windsurf etc and MCP servers can be database servers for database interaction, CRM servers for CRM system interaction or version control servers for interacting with version control softwares.

**Benefits** -
  - For AI app development - once you have an MCP compatible client, you can connect it to any MCP server.
  - For API or tool developers - build an MCP server and it can be adopted everywhere.
  - For End Users - The applications will be context rich.


## MCP Deep Dive
- Imagine server as a switchboard with multiple switches on it, and every switch has some specific functionality, you explain the functionality to the switch to your client with the help of prompts as the part of server definition to the client. These tools can invoke reading and writign of the data
