
#!/bin/bash

for n in *.js.br;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.js;
do
    brotli $n;
    echo "br" $n "成功";
done

for n in *.css.br;
do
    rm $n;
    echo "删除" $n "成功";
done

for n in *.css;
do
    brotli $n;
    echo "br" $n "成功";
done
