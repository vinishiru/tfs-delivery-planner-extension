#Dicas para Clone

0. Clonar o repositório na pasta de preferência.
0. Criar as pastas sdk/nome_modules e sdk/scripts
0. Na pasta sdk, rodar o comando para instalar o sdk de extensions:
```
npm install vss-web-extension-sdk
```

#Empacotando Extension

0. Instalar a ferramenta de geração de pacote `npm i -g tfx-cli`.
0. Após instalação, rodar o comando
```
tfx extension create --manifest-globs vss-extension.json
```
0. Será gerado um arquivo vsix, que pode ser publicado na galeria do TFS Online e publicado. O pacote pode ser instalado em TFS local navegando na galeria do TFS e fazendo upload do pacote através do portal.

As informações no manifest (vss-extension.json) devem estar coerentes com publisher, category e contributions para que seja possível publicar

Esse template de projeto foi gerado usando Yeoman.

#Welcome to Visual Studio Team Services Extensions!

###Please note that version 3.0 contains changes that could break existing project structures.  It also leverages TypeScript 2.0.
###This project template was put together to help you get started quickly with VSTS extension development.  The following components are included:

- The `VSS.SDK.js` file, required for JavaScript interaction with VSTS
- The `vss-extension.json` file, needed to define the metadata of the extension you are developing
- A simple `index.html` page, used to display content in your extension
- A `gruntfile.js` file to leverage GruntJS for running the `tfx` package and publish commands
- An app.ts TypeScript file, which gives you a very simple timekeeping module
- A sample logo file (replace this with the logo you wish to use for your extension)
- A sample Jasmine spec file (`test/TestSpec.js`) to help get you started with the Jasmine testing framework (special thanks to [Niel Zeeman](http://blogs.msdn.com/b/willy-peter_schaub/archive/2013/11/01/introducing-the-visual-studio-alm-rangers-niel-zeeman.aspx))
- `tfignore` and `gitignore` files that you can use to exclude the `settings.tfx.json` settings file.  This will safeguard you against accidentally checking in your personal access token or other sensitive VS Marketplace credentials.

This has been updated to be inline with the [M109](https://www.visualstudio.com/en-us/integrate/extensions/support/release-notes) release, which includes support for VSTS hosting of static content (.html,.css,.js) and the use of the tfx utility.

#### If you run into any issues with the version of Node that is installed with the Node.js Tools for Visual Studio, you can change the path to Node by going into Tools -> Options -> Projects and Solutions -> External Web Tools.

### For further information, please consult the following websites:
- The VSTS Extensions page on [MSDN](https://www.visualstudio.com/en-us/integrate/extensions/overview)
- The VSTS Extensions sample repo on [GitHub](https://github.com/Microsoft/vsts-extension-samples)
- A great [example](https://binary-stuff.com/post/a-hello-world-for-vso-extensions) project from Visual Studio ALM Ranger Gordon Beeming

#### Thanks for choosing this project template.  Candid feedback is always welcome!

Josh