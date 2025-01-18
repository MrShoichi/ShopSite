package ru.shoichi.shopsite.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.Serializable;
import java.util.Date;
import java.util.Set;

@Slf4j
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
@Table(name = "clothes")
public class Cloth implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "image_id")
    private Image image;

    @Column(name = "description")
    private String description;

    @Column(name = "date_publish")
    private Date datePublish;

    @Column(name = "price")
    private int price;

    @Column(name = "type")
    private ClothesType type;

    @OneToMany(mappedBy = "cloth", fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private Set<BasketItem> items;

    @PrePersist
    protected void onCreate() {
        this.datePublish = new Date();
    }
}