package com.rzevsky.test_cards01.service;

import com.rzevsky.test_cards01.model.Card;
import com.rzevsky.test_cards01.repository.CardRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CardServiceImpl implements CardService {

    @Autowired
    private CardRepository cardRepository;

    @PostConstruct
    public void initCardsIfDbEmpty() {
        if (cardRepository.count() == 0) {
            cardRepository.save(new Card("Мама", "Mother", "https://wallpapercave.com/wp/wp9055466.jpg"));
            cardRepository.save(new Card("Мыла", "Washed", "https://www.millersatwork.com/hubfs/iStock-467706864.jpg"));
            cardRepository.save(new Card("Раму", "Frame", "https://static.tildacdn.com/tild3361-6137-4835-b062-386164333762/rama_noback_standart.png"));
            cardRepository.save(new Card("Шла", "Went", "https://sundae.com/wp-content/uploads/2020/08/7-Home-selling-mistakes-and-how-to-avoid-them.jpg"));
            cardRepository.save(new Card("Саша", "Alexndra", "https://avatars.dzeninfra.ru/get-zen_doc/8302711/pub_6454c9f928226754d7fd4bac_6454cfd36974c023470757f5/scale_1200"));
            cardRepository.save(new Card("Шоссе", "Highway", "https://cdn.culture.ru/images/dc17f8b9-ca44-5f29-a52b-6828ff1cc781"));
        }
    }

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
