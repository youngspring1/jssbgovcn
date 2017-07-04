#!/usr/bin/pythonw
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import urllib.request
import csv


year = '2016'
month = 2 #All data start from Feb.
urllist = []
# read csv,get url

with open('../data/' + year + '_urllist.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
    for row in spamreader:
        if row[0] == '全社会用电量指标':
            urllist = row[2:] #All data start from Feb. Skip row[0] and row[1]

#print('url num:' + str(len(urllist))) # url num:11
#print('\n'.join(urllist))

for target_url in urllist:
    page = []

    data = urllib.request.urlopen(target_url)
    datastr = data.read().decode(encoding='utf-8')
    soup = BeautifulSoup(datastr, 'lxml')
    table = soup.find(class_ = 'MsoNormalTable')
    tbody = table.tbody.contents
    #print(tbody)

    #parse data
    for tr in tbody:
        if tr != ' ':
            tdlist = tr.contents
            line = []
            for td in tdlist:
                if td != ' ':
                    cell = ''
                    for result in td.find_all('span'):
                        if str(result.string) != 'None' and str(result.string) != '#':
                            cell += str(result.string).replace(' ', '').replace('　', '').strip()
                    line.append(cell)
            #print(' : '.join(line))
            page.append(line)

    # output
    with open('../data/' + year + '_' + str(month) + '_electricity.csv', 'w', newline='') as datacsv:
        csvwriter = csv.writer(datacsv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        for line in page:
            csvwriter.writerow(line)

    month += 1