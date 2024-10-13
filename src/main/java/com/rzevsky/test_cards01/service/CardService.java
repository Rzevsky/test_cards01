package com.rzevsky.test_cards01.service;

import com.rzevsky.test_cards01.model.Card;
import com.rzevsky.test_cards01.repository.CardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    public Optional<Card> getCardById(Long cardId) {
        return cardRepository.findById(cardId);
    }

    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }

    public Card updateCard(Long cardId, Card updatedCard) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        card.setTerm(updatedCard.getTerm());
        card.setDefinition(updatedCard.getDefinition());
        card.setUrl(updatedCard.getUrl());
        return cardRepository.save(card);
    }

    public void deleteCard(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("Card not found"));
        cardRepository.delete(card);
    }
}
