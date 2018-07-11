#!/bin/bash

# This is needed due to https://github.com/facebook/react-native/issues/18022
# Both GVRSDK (used in Viro) and React have the same object vlog_is_on
# Run this script after install pods to remove this object from GVRSDK

cd ./Pods/GVRSDK/Libraries/
lipo -info libGVRSDK.a

architectures="armv7 i386 x86_64 arm64"
for arch in $architectures
do
    echo Create thin archive libGVRSDK_$arch
    lipo -thin $arch libGVRSDK.a -output libGVRSDK_$arch
    chmod 777 libGVRSDK_$arch

    remove=""
    for object in $(ar -t libGVRSDK_$arch)
    do
        if [[ ${object} == vlog_is_on_* ]]
        then
            echo $object
            remove=$object
        fi
    done

    if [ $remove ]
    then
        echo removing $remove from $arch
        ar -dv libGVRSDK_$arch $remove
    else
        echo No symbol matching "vlog_is_on_*" found for $arch
    fi

done

echo Rebuild libGVRSDK.a
lipo -create libGVRSDK_armv7 libGVRSDK_i386 libGVRSDK_x86_64 libGVRSDK_arm64 -output libGVRSDK.a

for arch in $architectures
do
    rm libGVRSDK_$arch
    echo Delete thin archive libGVRSDK_$arch
done

cd ../../../
