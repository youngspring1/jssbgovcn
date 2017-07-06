### 江苏省统计局信息可视化PoC

### 可视化页面
[江苏省电力消耗和存贷款情况](https://youngspring1.github.io/jssbgovcn/doc/jssb.html)   
 


### 开发步骤
##### 1.需求分析
考虑可视化系统的目的，系统需要展示什么信息，目标受众希望看到什么样的信息，需要哪些依据来辅助决策。   
这些事可视化系统的前提。   

##### 2.获取数据
开发爬虫获取统计局的公开信息。    
公开页面：江苏省统计局 > 统计信息公开 > 统计数据 > 进度数据 > YYYY年度    
链接：http://www.jssb.gov.cn/tjxxgk/tjsj/jdsj/{YYYY}/   
爬虫目录：/crawler   

        01.getURLList.py.........获取该年份的所有链接   
        02.getElectricity.py.....获取该年份的用电量统计   
        04.getDepositloan.py.....获取该年份的存款贷款信息   

注意：统计局不统计1月份的数据，可能是过年放假不上班:-P
爬取到的数据，按照后面的展示的需要，生成json文件，放在/data目录下。

##### 3.原型图表开发
目前使用的是百度的[echarts](http://echarts.baidu.com/)生成可视化图形。   
你也可以使用[d3.js](https://d3js.org/)等其他工具。   
首先生成单个的原型图表，可以当成草稿，可能需要根据图表的需要，修改前面一步中生成的json数据。原型图表见下面页面：   
[按地区展示用电量，可手动选择月份](https://youngspring1.github.io/jssbgovcn/doc/01.map.html)   
[直方图展示各地区用电量，自动遍历月份](https://youngspring1.github.io/jssbgovcn/doc/02.electricity.html)   
[直方图展示各地区存款贷款情况，自动遍历月份](https://youngspring1.github.io/jssbgovcn/doc/04.depositloan.html)  

##### 4.可视化页面设计
页面设计请咨询专业人员，近期可以灵活利用BICC的设计案，把图替换成我们的数据。   

##### 5.可视化页面开发
按照设计方案实现页面。   
  

### TODO

1. 其他年份的数据抽取   
	现在只抽取了2016年的数据，如果需要实现header上切换年份的功能，需要抽取其他年份的数据。   
	*.py文件里面已经定义了年份的变量，修改变量的数值或者按年份循环即可。
2. 数据间关系的分析   
	江苏省统计局的数据间的关系比较弱，可以考虑收入／消费／房产等信息的关联分析。   
