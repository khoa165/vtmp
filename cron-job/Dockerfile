FROM ubuntu:24.04
RUN apt-get update && apt-get install -y \
cron \
tini \
curl \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash adminCron
USER adminCron
WORKDIR /home/adminCron
COPY --chown=adminCron:adminCron ./cron-job/crontab .
RUN crontab /home/adminCron/crontab

USER root

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["cron", "-f"]