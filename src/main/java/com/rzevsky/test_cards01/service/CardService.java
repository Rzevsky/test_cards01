package com.rzevsky.test_cards01.service;

//import com.rzevsky.test_cards01.model.Card;
//import org.springframework.stereotype.Service;

import com.rzevsky.test_cards01.model.Card;

import java.util.List;
import java.util.Optional;

public interface CardService {
    public List<Card> getAllCards();
    public Optional<Card> getCardById(Long cardId);
    public Card saveCard(Card card);
    public Card updateCard(Long cardId, Card updatedCard);
    public void deleteCard(Long cardId);
}
