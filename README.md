## Create Open Format App

Create Open Format App is a command-line tool for easily setting up and starting a new Open Format app project. It provides a simple and efficient way to initialize an Open Format app with minimal configuration, allowing you to focus on writing code and building your application.

### Features

- Simple command-line interface
- Supports multiple templates
- Automatic detection and usage of preferred package manager (npm, yarn, or pnpm)
- Built-in environment variable management
- Easy project setup and initialization

### Installation

You can use npx to run Create Open Format App without installing it globally. Alternatively, you can install it globally using npm or your preferred package manager.

```bash
# With npx (recommended)
npx create-open-format-app <projectName>

# Global installation with npm

npm install -g create-open-format-app
create-open-format-app <projectName>

# Global installation with yarn

yarn global add create-open-format-app
create-open-format-app <projectName>
```

### Usage

To create a new Open Format dApp project, simply run the following command:

```bash
npx create-open-format-app <projectName>
```

Replace <projectName> with the name of your project.

### Options

Create Open Format App supports several options for customizing the project creation process:

- `--with-web2-auth`: Add web2 authentication.
- `--package-manager <packageManager>`: Specify the package manager to use (npm, yarn, or pnpm).

Example:

```bash
npx create-open-format-app my-dapp --with-web2-auth --package-manager yarn
```

This command will create a new project called "my-dapp" including Web 2 authentication and yarn as the package manager.

### Next Steps

After creating your project, navigate to the project folder and start the development server:

```bash
cd <projectName>
npm run dev

# or

yarn dev

# or

pnpm run dev
```

The application will be available at http://localhost:3000.
