#!/bin/bash

# Install Homebrew if it is not already installed
which brew || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add the Google Chrome cask to Homebrew
brew tap homebrew/cask
brew update

# Install Google Chrome
brew install --cask google-chrome
