Alan Wake [On Lan]
---

This project runs a TelegramBot which will listen to a `start` command on Telegram which will send a [Wake-On-Lan Magic Packet](https://en.wikipedia.org/wiki/Wake-on-LAN) to turn on a computer in the network identified by the MAC address.

# Configuration
All configs are set via environment variables (check `.env.example`) and the MAC addresses (+ permissions) are set in a DynamoDB table called `alan-wake`.

## DynamoDB table
- The table must contain:
- a string attribute `mac` which is the primary partition key
- a string `alias`
- a list of strings `users`.

# Running

To run in dev mode: `npm run dev`.
To run in prod mode: `npm start`.

`start.sh` file are available to allow starting the application on the startup, which will keep the application running after rebooting the host running this application.

# Motivation

- Run the application on a [Omega2+](https://onion.io/store/omega2p/) (Raspberry Pi, Arduino, or anything that runs NodeJS), which will turn on my Home desktop, which is a gaming PC. The Home desktop will boot on Windows (default option in Grub). As soon as Windows boot, [Steam](https://store.steampowered.com) and [Parsec](https://parsecgaming.com/) will also start, allowing me to play my games via Internet.
