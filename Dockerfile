FROM node:alpine
# This line basically says ‘we need to use this light-weight version of Linux which has Node pre-installed’

# EXPOSE 3000
# This line opens port 3000
COPY . /app
# This line copies everything from the directory (.) in to the folder (/app)
WORKDIR /app
# This line says that we want to run all commands within the folder (/app)
RUN npm i
# This line installs the node packages.

CMD [ "node", "index.js" ]
# This line runs the command ‘node index.js’
# from before: [ “node”, “index.js” ]