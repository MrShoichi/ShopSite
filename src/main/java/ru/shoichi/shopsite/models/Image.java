package ru.shoichi.shopsite.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Table(name = "images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Image implements Serializable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    private String type;

    @Lob
    @Column(name = "imagedata", length = 1000)
    private byte[] imageData;

    @Override
    public String toString() {
        return "Image{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                '}';
    }


}