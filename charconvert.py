#!/usr/bin/python
#this script should read in a few files and spit out a useful SAIKS js file
#you can see an example on https://github.com/jdrizin/saiks

#i'm using regexpn
import re

#read in the files and strip newlines
coding = [line.strip() for line in open('/home/josh/artocarpus/saiks/charactercoding.csv')]
states = [line.strip() for line in open('/home/josh/artocarpus/saiks/characterstates.csv')]

#define some saiks variables

# var dataset = "hmtl code" - this goes in the top frame
dataset = 'var dataset = "<center><h2><b>Artocarpus</b></h2></center>"'

# var binary - setting this to 0 allows multistate variables
varbin = "var binary = 0"

#char strings for the first js variable - append state data
varchars = 'var chars = [[ "Scientific name"],\n'

#append coding data
varitems = 'var items = [ [""],\n'

#wrap the csv lines in [],\n;
wcoding = ["[" + s + "],\n" for s in coding]
wstates = ["[" + s + "],\n" for s in states]

#replace ,\n in the last element with ];, the closing phrase
wcoding[-1] = re.sub(',\\n', '];', wcoding[-1] )
wstates[-1] = re.sub(',\\n', '];', wstates[-1] )

#output everything
output = (dataset + "\n" + varbin + "\n" + 
		  varchars + ''.join(str(elem) for elem in wstates) + "\n" +
		  varitems + ''.join(str(elem) for elem in wcoding))

#write out a text file
text_file = open("/home/josh/artocarpus/saiks/artocarpus.js", "w")
text_file.write(output)
text_file.close