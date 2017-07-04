#!/usr/bin/pythonw
# -*- coding: utf-8 -*-

from bs4 import BeautifulSoup
import urllib.request
import csv


year = '2016'
month = 2 #All data start from Feb.
month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
city_name  = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市']

def main():
    urllist = []

    # read csv,get url
    with open('../data/' + year + '_urllist.csv', newline='') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=',', quotechar='"')
        for row in spamreader:
            if row[0] == '全社会用电量指标':
                urllist = row[2:] #All data start from Feb. Skip row[0] and row[1]

    #print('url num:' + str(len(urllist))) # url num:11
    #print('\n'.join(urllist))
    yeardata = []
    for target_url in urllist:
        page = []
        monthdata = []


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
                if line[0].endswith('市') and line[0] not in ['昆山市', '泰兴市', '沭阳县']:
                    monthdata.append(line[1])
        yeardata.append(monthdata)
        #print(len(monthdata))
        #print(len(yeardata))

    yeardata.insert(0, yeardata[10])#insert fake data for Jan
    #print(len(yeardata))
    #print(len(yeardata[0]))

    # output monthly electricity json
    f = open('../data/' + year + '_electricity.json', 'w')
    f.write(indentation(0) + '{\n')
    f.write(indentation(1) + '"monthlydata" : [\n')
    for month in range(len(month_name)):
        if month != len(month_name) - 1 :
            f.write(indentation(2) + '[' + ','.join(yeardata[month]) + '],\n')
        else:
            f.write(indentation(2) + '[' + ','.join(yeardata[month]) + ']\n')
    f.write(indentation(1) + ']\n')
    f.write(indentation(0) + '}\n')
    f.close()

    # output map electricity json
    f = open('../data/' + year + '_map_electricity.json', 'w')
    f.write(indentation(0) + '{\n')
    f.write(indentation(1) + '"electricity" : [\n')
    for month in range(len(month_name)):
        f.write(indentation(2) + '{\n')
        f.write(indentation(3) + '"month" : [\n')
        for city in range(len(city_name)):
            f.write(indentation(4) + '{')
            f.write(indentation(0) + '"name" : "' + city_name[city] + '", ')
            f.write(indentation(0) + '"value" : ' + str(yeardata[month][city]) + '')
            if city == (len(city_name) - 1):
                f.write(indentation(0) + '}\n')
            else:
                f.write(indentation(0) + '},\n')

        f.write(indentation(3) + ']\n')

        if month  == (len(month_name)-1):
            f.write(indentation(2) + '}\n')
        else:
            f.write(indentation(2) + '},\n')

    f.write(indentation(1) + ']\n')
    f.write(indentation(0) + '}\n')
    f.close()

def indentation(number):
    space = '    '
    return '' + space * number

if __name__ == '__main__':
    main()