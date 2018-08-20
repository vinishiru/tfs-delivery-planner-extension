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

