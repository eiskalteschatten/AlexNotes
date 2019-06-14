FROM alexseifert/alexnotes:latest

# Then add the hostname of your git repository to the known_hosts file if you are using SSH
RUN mkdir -p ~/.ssh && ssh-keyscan -t rsa gitlab.com > ~/.ssh/known_hosts


# Add a user for security purposes so that the app doesn't run as root
RUN adduser -h /home/alexnotes -D -s /bin/sh alexnotes && \
    chown -R alexnotes:alexnotes ./packages/frontend/src && \
    chown -R alexnotes:alexnotes ./packages/server/src

USER alexnotes

RUN git config --global user.email "your@emailaddress.com" && \
    git config --global user.name "Your Name"

EXPOSE 3010
