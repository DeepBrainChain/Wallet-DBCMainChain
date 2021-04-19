
#!/bin/bash

for n in *.js.gz;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.js;
do
    gzip -k $n;
    echo "gzip" $n "成功";
done


for n in *.css.gz;
do
    rm $n;
    echo "删除" $n "成功";
done


for n in *.css;
do
    gzip -k $n;
    echo "gzip" $n "成功";
done
