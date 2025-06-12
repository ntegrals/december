<a name="readme-top"></a>

<div align="center">

<h3 align="center">Say hi to December ☃️</h3>

  <p align="center">
    December is an open-source Loveable, Replit or Bolt alternative that you can run locally with your own API keys, ensuring complete privacy and significant cost savings.
    <br />
    <br />
    <a href="https://december.ai">View Documentation</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=bug&projects=&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/ntegrals/december/issues/new?assignees=&labels=enhancement&projects=&template=feature_request.md&title=">Request Feature</a>

  </p>
</div>

<p align="center">
  <!-- Keep these links. Translations will automatically update with the README. -->
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=de">Deutsch</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=es">Español</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=fr">français</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=ja">日本語</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=ko">한국어</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=pt">Português</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=ru">Русский</a> | 
  <a href="https://www.readme-i18n.com/ntegrals/december?lang=zh">中文</a>
</p>

<a href="https://github.com/ntegrals/december">
    <img src=".assets/preview.png" alt="December Preview">
  </a>

## Features

    ✅ AI-powered project creation from natural language prompts
    ✅ Containerized Next.js applications with Docker
    ✅ Live preview with mobile and desktop views
    ✅ Full-featured Monaco code editor with file management
    ✅ Real-time chat assistant for development help
    ✅ Project export and deployment capabilities

## Get started (~2 minutes)

1. Clone the repo

   ```sh
   git clone https://github.com/ntegrals/december
   ```

2. Get an API Key from any OpenAI sdk compatible provider (e.g. OpenAI, Claude, Ollama, OpenRouter, etc.) and set it in the `config.ts` file.

   The start.sh script will automatically copy over the file into the backend folder.

   I highly recommend using Sonnet-4 from Anthropic as it is the best coding model available right now.

   ```sh
    baseUrl: "https://openrouter.ai/api/v1",

    apiKey:
      "sk-...",

    model: "anthropic/claude-sonnet-4",
    temperature: 0.7,
   ```

3. Install docker (Docker Desktop is the easiest way to get started)

   - [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
   - [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - [Docker Engine for Linux](https://docs.docker.com/engine/install/)

   Make sure you have Docker running and the Docker CLI installed before proceeding.

4. Run the start script to set up the environment

   ```sh
   sh start.sh
   ```

5. The application will start in development mode, and you can access it at [http://localhost:3000](http://localhost:3000).

   The backend will run on port 4000, and the frontend will run on port 3000.

   You can now start building your applications with December! 🥳

<!-- ## Demo

You can test the December here: [https://december.ai](https://december.ai) -->

## Motivation

AI-powered development platforms have revolutionized how we build applications. They allow developers to go from idea to working application in seconds, but most solutions are closed-source or require expensive subscriptions.

Until recently, building a local alternative that matched the speed and capabilities of platforms like Loveable, Replit, or Bolt seemed challenging. The recent advances in AI and containerization technologies have made it possible to build a fast, local development environment that gives you full control over your code and API usage.

I would love for this repo to become the go-to place for people who want to run their own AI-powered development environment. I've been working on this project for a while now and I'm really excited to share it with you.

## Why run December locally?

Building applications shouldn't require expensive subscriptions or sacrificing your privacy. December gives you the power of platforms like Loveable, Replit, and Bolt without the downsides:

- **Full Control & Privacy** - Your code, ideas, and projects never leave your machine. No cloud storage, no data mining, no vendor lock-in
- **Your API Keys, Your Costs** - Use your own OpenAI API key and pay only for what you use. No monthly subscriptions or usage limits imposed by third parties
- **Complete Feature Access** - No paywalls, premium tiers, or artificial limitations. Every feature is available from day one

Most cloud-based AI development platforms charge $20-100+ per month while limiting your usage and storing your intellectual property on their servers. With December, a $5 OpenAI API credit can generate dozens of complete applications, and you keep full ownership of everything you create.

The local-first approach means you can work offline, modify the platform itself, and never worry about service outages or policy changes affecting your projects. Your development environment evolves with your needs, not a company's business model.

December proves that you don't need to choose between powerful AI assistance and maintaining control over your work. Run it locally, use your own API keys, and build without boundaries.

## Contact

Hi! Thanks for checking out and using this project. If you are interested in discussing your project, require mentorship, consider hiring me, or just wanna chat - I'm happy to talk.

You can send me an email to get in touch: j.schoen@mail.com or message me on Twitter: [@julianschoen](https://twitter.com/julianschoen)

Thanks and have an awesome day 👋

## Disclaimer

December, is an experimental application and is provided "as-is" without any warranty, express or implied. By using this software, you agree to assume all risks associated with its use, including but not limited to data loss, system failure, or any other issues that may arise.

The developers and contributors of this project do not accept any responsibility or liability for any losses, damages, or other consequences that may occur as a result of using this software. You are solely responsible for any decisions and actions taken based on the information provided by December.

Please note that the use of the large language models can be expensive due to its token usage. By utilizing this project, you acknowledge that you are responsible for monitoring and managing your own token usage and the associated costs. It is highly recommended to check your API usage regularly and set up any necessary limits or alerts to prevent unexpected charges.

By using December, you agree to indemnify, defend, and hold harmless the developers, contributors, and any affiliated parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from your use of this software or your violation of these terms.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.
