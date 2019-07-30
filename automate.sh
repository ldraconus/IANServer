#!/bin/bash

while true
do
   git remote update > /dev/null 2>&1
   git pull > /tmp/git.txt
   result=`cat /tmp/git.txt`
   if [ "$result" == "Already up to date." ]; then
      echo "No changes detected" > /dev/null 2>&1
   else
      echo "Web files updated"
      cp public/IAN.html public/codeIAN.js public/login.css public/styleIAN.css public/*.png ../public
   fi
   sleep 10
done | ts >> /tmp/automate.log
