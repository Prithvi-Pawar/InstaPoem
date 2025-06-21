InstaPoem
=========

InstaPoem is an AI-powered web app that generates beautiful poems and quotes from your photos. Just upload an image and let the AI create poetic magic — optionally translating the results into different languages.

Features
--------

- AI-generated poems from images
- Quote creation from generated poems
- Multilingual translation support
- Intuitive photo upload interface
- Built with Next.js, Tailwind CSS, and Genkit AI flows

Project Structure
-----------------

InstaPoem/
├── src/
│   ├── ai/                  # AI flows and logic
│   │   └── flows/           # Poem, quote, translation flows
│   └── app/                 # Next.js pages and routing
├── docs/                    # Project planning and blueprint
├── public/                  # Static assets
├── .vscode/                 # IDE settings
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind setup
├── next.config.ts           # Next.js config

Getting Started
---------------

Prerequisites:
- Node.js ≥ 18
- npm or yarn

Installation:
1. Clone the repository
   git clone https://github.com/your-username/InstaPoem.git
2. Move into the project directory
   cd InstaPoem
3. Install dependencies
   npm install

Running the Development Server:
   npm run dev

Building for Production:
   npm run build

AI Logic
--------

The core AI logic is powered by Genkit flows:

- generate-poem-from-photo.ts
- generate-quote-from-poem.ts
- translate-poem-flow.ts

Modify or extend these flows inside `src/ai/flows/`.

Testing
-------

This app is under active development. Tests can be added using your preferred framework (e.g., Vitest, Jest).

License
-------

MIT License

Contributing
------------

1. Fork the repository
2. Create a new branch (git checkout -b feature-name)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Contact
-------

Made with ❤️ 
