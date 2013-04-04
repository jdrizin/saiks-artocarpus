#!/usr/bin/python
#this script should read in a few files and spit out a useful SAIKS js file
#you can see an example on https://github.com/jdrizin/saiks

#read in the files and strip newlines
coding = [line.strip() for line in open('/home/josh/artocarpus/saiks/charactercoding.csv')]
states = [line.strip() for line in open('/home/josh/artocarpus/saiks/characterstates.csv')]

#define some saiks variables

# var dataset = "hmtl code" - this goes in the top frame
dataset = 'var dataset = "<center><h2><b>Artocarpus</b></h2></center>"'

# var binary - setting this to 0 allows multistate variables
varbin = "var binary = 0"




#wrap the csv lines in [],\n;
wcoding = ["[" + s + "],\n" for s in coding]
wstates = ["[" + s + "],\n" for s in states]