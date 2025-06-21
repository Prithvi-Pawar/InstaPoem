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

InstaPoem/<br>
├── src/<br>
│   ├── ai/                      
│   │   └── flows/               
│   └── app/                   
├── docs/                        
├── public/                      
├── .vscode/                     
├── package.json                 
├── tailwind.config.ts         
├── next.config.ts               

Getting Started
---------------

Prerequisites:
- Node.js ≥ 18
- npm or yarn

Installation:
1. Clone the repository
   git clone- [https://github.com/your-username/InstaPoem.git](https://github.com/Prithvi-Pawar/InstaPoem.git)
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

You can modify or extend these flows inside `src/ai/flows/`.

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

Made with ❤️ by [Prithvi Pawar]
