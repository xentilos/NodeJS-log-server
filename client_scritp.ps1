$logfilename = "test"
$varable1 = "1"
$varable2 = "2"
$varable3 = "3"
#---
# do not change it
#---
$logserver = "helmgmt21.ad2.kemira.com" 
[System.Net.WebRequest]::Create("http://"+$logserver+":8080/?outfile=$logfilename&arg1=$varable1&arg2=$varable2&arg3=$varable3").GetResponse().Close