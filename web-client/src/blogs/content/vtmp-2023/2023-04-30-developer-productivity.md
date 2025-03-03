---
title: Developer productivity hacks
author: Khoa Le
description: Bootstrap your productivity with terminal setup and command usages
date: 04-30-2023
tags: technical
banner: https://i.ytimg.com/vi/ulEr4zSHL-c/maxresdefault.jpg
---

## Beautify your terminal

This part is tricky since each of your laptop probably has different configurations. Post your questions in Discord if you get stuck

For Windows: [dev.to](https://dev.to/vsalbuq/how-to-install-oh-my-zsh-on-windows-10-home-edition-49g2)  
For Mac: [freecodecamp.org](https://www.freecodecamp.org/news/how-to-configure-your-macos-terminal-with-zsh-like-a-pro-c0ab3f3c1156/)

## Setup aliases

#### Create a file for your own aliases

```bash
alias cl="clear"
alias gac="git add .; git commit -m"
alias gacp="git add .; git commit -m \"Update\"; git push origin HEAD"
alias tc="touch"
alias d="cd ~/Desktop"
alias co="cd ~/Desktop/code"
alias cra="npx create-react-app"
alias gp="git push origin HEAD"
alias gpl="git pull origin HEAD"
```

#### Import it .bashrc, or .bash_profile, or .zshrc fil

```bash
cd ~
ls -al
# Place the following line in .bashrc, or .bash_profile, or .zshrc (whatever the file that your shell system is based on, you should see it in the output of previous command)
[[ -f "$HOME/.aliases" ]] && source "$HOME/.aliases"
```

## Visual Studio Code

Open Visual Studio Code, click Cmd + Shift + P, then type

```text
Shell Command: Install 'code' command in PATH
```

Once you enable it, you should be able to open current directory in VSCode using terminal

```bash
code .
```

Open a specific file

```bash
code ~/.zshrc
```
