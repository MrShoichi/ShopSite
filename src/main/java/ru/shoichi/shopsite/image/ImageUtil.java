package ru.shoichi.shopsite.image;
import ru.shoichi.shopsite.models.Image;

import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.regex.Pattern;
import java.util.zip.Deflater;
import java.util.zip.Inflater;


public class ImageUtil {

    public static void compressImage(Image image) {
        if(image.getImageData().length == 0) return;
        byte[] data = image.getImageData();
        Deflater deflater = new Deflater();
        deflater.setLevel(Deflater.BEST_COMPRESSION);
        deflater.setInput(data);
        deflater.finish();


        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        while (!deflater.finished()) {
            int size = deflater.deflate(tmp);
            outputStream.write(tmp, 0, size);
        }
        try {
            outputStream.close();
        } catch (Exception e) {
        }
        image.setImageData(outputStream.toByteArray());
    }

    public static void decompressImage(Image image) {
        if(image.getImageData().length == 0) return;
        byte[] data = image.getImageData();
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] tmp = new byte[4*1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(tmp);
                outputStream.write(tmp, 0, count);
            }
            outputStream.close();
        } catch (Exception exception) {
        }
        image.setImageData(outputStream.toByteArray());
    }
}