package com.rzevsky.test_cards01.controllers;

import com.rzevsky.test_cards01.model.Card;
import com.rzevsky.test_cards01.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @GetMapping
    public List<Card> getAllCards() {
        return cardService.getAllCards();
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<Card> getCardById(@PathVariable Long cardId) {
        Optional<Card> card = cardService.getCardById(cardId);
        if (card.isPresent()) {
            return ResponseEntity.ok(card.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Card addCard(@RequestBody Card card) {
        return cardService.saveCard(card);
    }

    @PutMapping("/{cardId}")
    public ResponseEntity<Card> updateCard(@PathVariable Long cardId, @RequestBody Card updatedCard) {
        try {
            Card card = cardService.updateCard(cardId, updatedCard);
            return ResponseEntity.ok(card);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
