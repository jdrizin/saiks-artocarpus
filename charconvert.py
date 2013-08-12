#!/usr/bin/env python2.7
#this script should read in a few files and spit out a useful SAIKS js file
#you can see an example on https://github.com/jdrizin/saiks
# i wrote this for py2.7. i haven't learned py3k or anything.

#copyright (c) 2013,  Josh Drizin. license: GPLv2

#i'm using re.sub and argparse
import re
import argparse

parser = argparse.ArgumentParser(description='Process coding and state CSV files into SAIKS/SLIKS format, stripping uncoded species and converting unknown character values into wildcards')
parser.add_argument("coding", help="filename for the species coding CSV file")
parser.add_argument("states", help="filename for the character states CSV file")
parser.add_argument("output", help="output filename")
parser.add_argument("-v", action='store_true', dest="printverbose", default=False, help="Display the species names that were stripped due to missing character coding")
parser.add_argument("-i", action='store_true', dest="divimage", default=False, help="Wrap character description images in <div> tags to display them on the key. Optional.")
args = parser.parse_args()

#read in the files, strip newlines, remove header
coding = [line.strip() for line in open(args.coding)]
states = [line.strip() for line in open(args.states)]
del coding[0]
del states[0]

#find the ones that we're going to remove and print them, if -v
if args.printverbose:
    codingremoved = [x for x in coding if (',,,' in x)]  # list of bad ones
    removedspecies = [re.findall('"([^"]*)"', x) for x in codingremoved]
    print removedspecies

## strip out 'blank' codes, missing characters break SAIKS
codingc1 = [x for x in coding if not (',,,' in x)]
#change missing data, jj (previously -), to wildcard, ?
codingc2 = [re.sub('"jj"', '"?"', s) for s in codingc1]
codingc3 = [re.sub(',([0-9]+)', r',"\1"', s) for s in codingc2]  # add "" to all fields
#remove trailing commas
statesc1 = [re.sub(',+$', '', s) for s in states]

# optional: use images in states! by wrapping the species name in a div, we can
# display a popup with some javascript.
# <div class='cell' data-images='PATH/TO/IMAGE'>leaf type</div>, rather than 'leaf type'
# this is not required, so i put it behind a command-line option. it assumes file paths
# are in the column to the left of the species name.

def divsmush(line):
    kaboom = line.split(',')
    if kaboom[0] != '':
        # handle categories, which are split with |.
        if '|' in kaboom[1]:
            piped = kaboom[1].split('|')
            smushed = piped[0] + '|' + '<div class=\'cell\' image-data=\'' + kaboom[0].replace('"', '') + "'>" + piped[1].replace('"', '') + '</div>"'
        else:
            smushed = '"<div class=\'cell\' image-data=\'' + kaboom[0].replace('"', '') + "'>" + kaboom[1].replace('"', '') + '</div>"'
        kaboom[1] = smushed
    del kaboom[0]
    unkaboom = ','.join(kaboom)
    return unkaboom

if args.divimage:
    statesc1 = [divsmush(s) for s in statesc1]

#define some saiks variables
# var binary - setting this to 0 allows multistate variables
varbin = "var binary = false;"

#char strings for the first js variable - append state data
varchars = 'var chars = [[ "Scientific name"],\n'

#append coding data
varitems = 'var items = [ [""],\n'

#wrap the csv lines in [],\n;
wcoding = ["[" + s + "],\n" for s in codingc3]
wstates = ["[" + s + "],\n" for s in statesc1]

#replace ,\n in the last element with ];, the closing phrase
wcoding[-1] = re.sub(',\\n', '];', wcoding[-1])
wstates[-1] = re.sub(',\\n', '];', wstates[-1])

#output everything
output = (varbin + "\n\n" +
          varchars + ''.join(str(elem) for elem in wstates) + "\n\n" +
          varitems + ''.join(str(elem) for elem in wcoding))

#write out a text file
print "converted to SAIKS format!"
text_file = open(args.output, "w")
text_file.write(output)
text_file.close
