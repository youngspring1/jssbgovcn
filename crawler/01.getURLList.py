#!/usr/bin/pythonw
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import urllib.request

def main():
    year = '2016'
    target_url = 'http://www.jssb.gov.cn/tjxxgk/tjsj/jdsj/' + year
    data = urllib.request.urlopen(target_url)
    datastr = data.read().decode(encoding='utf-8')
    #print(datastr)

    soup = BeautifulSoup(datastr, 'lxml')
    #print(soup.title)
    #print(soup.title.string)

    #print(type(soup.table.contents))#list

    tmplist = soup.table.contents
    urllist = []
    for tr in tmplist:
        if tr != '\n' and tr.name != 'script':
            #trlist.append(tr)
            row = []
            for td in tr.contents:

                if td != '\n' and td.name != 'script':
                    
                    if td.find('a'):
                        row.append(target_url + td.find('a').get('href').replace('.', '', 1))
                    else:
                        row.append(td.string)
            
            urllist.append(row)

    #print(urllist)

    f = open('../data/' + year + '_urllist.csv', 'w')
    for line in urllist:
        f.write(','.join(line) + '\n')
    f.close()

if __name__ == '__main__':
    main()