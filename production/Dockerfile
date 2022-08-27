from ubuntu:latest
EXPOSE 80

run apt update && DEBIAN_FRONTEND=noninteractive apt install -y postgresql postgresql-contrib lsof python3 nginx virtualenv tree nano python3-dev libpq-dev texlive-latex-recommended texlive-science texlive-extra-utils

cmd ["/bin/bash"]
