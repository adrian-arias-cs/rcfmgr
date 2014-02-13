RCFmgr
==========

A simple cli tool for managing Rackspace Cloud Files.

Setup
-----

Create the config file in ~/.config/rcfmgr.ini

    [rcf]
    username = <your username>
    apiKey = <your api key>
    region = <the desired region>

Usage
--------------------

    Usage: node index.js [OPTION]

      -q, --quiet              quiet mode
      -v, --version            print version
      -c, --create-containers  create the listed containers
          --container=ARG+     deploy the the specified container
      -f, --force-yes          force yes to conditions which require a Y/n answer
      -l, --list-files         list the files in a container
      -u, --upload-file        upload a file to a container
      -d, --delete-file        delete a file to a container
      -h, --help               print usage


Examples
----------

List the files in a container.

    node index.js -l <container_name>

Upload a file to the specified container.

    node -u --container <container_name> <file>

Download a file from the specified container.

    node -d --container <container_name> <file>

