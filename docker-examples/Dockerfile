FROM alexseifert/alexnotes:latest

# Add your local git config to the Docker container
ADD ~/.gitconfig /etc/gitconfig

# Add your SSH key if your git repository is only accessible via SSH.
ADD ~/.ssh/id_rsa /home/alexnotes/.ssh/id_rsa

# Then add the hostname of the repository to the known_hosts
RUN mkdir -p ~/.ssh && ssh-keyscan -t rsa gitlab.com > ~/.ssh/known_hosts
