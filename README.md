# kasperengelen.github.io
Repository for personal website.

## Link to the website

Link: [kasperengelen.github.io](https://kasperengelen.github.io)

## Local installation on Ubuntu

Source: [https://jekyllrb.com/installation/docs/ubuntu/](https://jekyllrb.com/docs/installation/ubuntu/)

First, install the dependencies:
```
sudo apt-get install ruby-full build-essential zlib1g-dev
```

Then, set the installation directory of the Ruby packages to be located in the home folder:
```
echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

Finally, install Jekyll and Bundler:
```
gem install jekyll bundler
```

## Locally running the website

To run the website on localhost, execute the following commands:
```
rbenv local 3.3.0
bundle install
bundle exec jekyll serve --host=0.0.0.0
```
