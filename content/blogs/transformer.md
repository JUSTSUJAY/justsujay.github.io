---
title: Attending Transformers.
date: June 10, 2025
author: Sujay Kapadnis
---

I had the rough idea of transformers architecture from the famous Attention is all you need paper, which took everything by storm, because AI has existed for many decades now but until now either everything was kind of rule based or if not for every task you'd need to train a seperate model, but with transformers which initially showed Translation example, developed so much that now it almost feels like it understands what we write, what we see, what we hear, although its just a bunch of number computations and boom, its magical. So in this post we will go into an extremly big dimensional space which you can only imagine, exists. 

As of current date, you can just open any LLM interface, let it be of ChatGPT, grok, Claude. You ask it any question, let it be programming related, general question or literally anything you can think of. Yeah, if you make things up that still doesn't exist, then it will even go further and hallicunate another level, come on bruv, what's with that. But can hallicunation actually mean that they actually are just computing numbers and not pretending dumb untill they are ready to take over the world? Who knows. But till then let's hop into the absolute beauty of mathematics that is there.

So as you want to talk to an LLM, you go to any interface and start talking, is it understanding that text? No. The best it can make sense of is numbers. So first thing that we need to do is somehow map these words to some numbers.

The easiest way would be to check how many words are there in the language you want to train, in English there are around 171K words, now if we gave index for each of these numbers, it will be extreamly difficult to handle and if we only gave a number to alphabets and even symbols, it's about 95 printable charcters, so here the vocabulary is really small and in both cases, that index doesn't signify anything.

So for now just understand that researchers came up with the approach of tokenization, which keeps the balance of root words and prefixes suffices of commonly used words, There's a text tokenization technique called Byte Pair Encoding, it works by iteratively merging the most frequent adjacent pairs of characters or subwords, creating a vocabulary of subword units. This approach allows models to handle out-of-vocabulary words and improve representation of rare words and compounds. 

For this article, we'll be taking the architecture of GPT-3's largest model which had 175B parameters, for this model, the final number of tokens were 50257 tokens. That means, whatever the text you pass to this model, it will map it into tokens in this vocubulary which means that it handles the OOV problem.