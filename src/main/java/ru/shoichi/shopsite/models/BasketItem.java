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
import java.util.Objects;

@Slf4j
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data

@Entity
@Table(name = "bascket_items")
public class BasketItem implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "basket_id")
    @JsonBackReference
    private Basket basket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cloth_id", insertable = false, updatable = false)
    @JsonBackReference
    private Cloth cloth;

    @Column(name = "cloth_id")
    private long clothId;

    @Column(name = "quantity")
    private int quantity;

    @Override
    public int hashCode() {
        return Objects.hash(cloth.getId(), basket.getId(), quantity); // Используйте только примитивные или простые поля
    }
}
