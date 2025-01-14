package ru.shoichi.shopsite.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "baskets")
public class Basket implements Serializable {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "is_bought")
    private boolean isBought;

    @Column(name = "date_created")
    @Temporal(TemporalType.TIMESTAMP)
    private Date dateCreated;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "basket", fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private Set<BasketItem> items;


    @PrePersist
    protected void onCreate() {
        this.dateCreated = new Date();
    }
}
