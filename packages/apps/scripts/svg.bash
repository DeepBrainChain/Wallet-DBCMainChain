
#!/bin/bash

for n in *.svg.gz;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.svg.br;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.svg;
do
    gzip -k $n;
    echo "gzip" $n "成功";
    brotli $n;
    echo "br" $n "成功";
done


for n in *.png.gz;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.png.br;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.png;
do
    gzip -k $n;
    echo "gzip" $n "成功";
    brotli $n;
    echo "br" $n "成功";
done
