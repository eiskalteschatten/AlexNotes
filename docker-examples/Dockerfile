FROM alexseifert/alexnotes:latest

# Then add the hostname of your git repository to the known_hosts file if you are using SSH
RUN mkdir -p ~/.ssh && ssh-keyscan -t rsa gitlab.com > ~/.ssh/known_hosts
