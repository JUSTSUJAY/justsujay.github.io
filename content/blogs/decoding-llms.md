---
title: Decoding LLMs
date: March 28, 2025
author: Sujay Kapadnis
---

LLMs are impressive of course, but their mysterious black box nature still remains unknown about how things are happening the way they are. We are just aware that this architecture is being used and the process of training them. But post training, how exactly are they being so intellignet? Let's decode...

PS: This are my notes from this paper released by Anthropic.

Big Bang happened, universe was created, lives were born, and over the period of centuries the complexity of us living beings increased. The principal of evolution are kind of simple but the mechanisms of living is still intricate to comprehend. Same goes for our LLMs, the architecture and algos we know but there's more that we don't know. 

In biology, with every evolved microsope things kept getting clearer and clearer. We need that microscopic lens to understand LLMs as well. Even in the fields of AI, such efforts [1] [2] [3] [4] [5] have been made and are still ongoing.

The above efforts suggest that just like cell is the interpretable building block in biological system, there must be "features" (not literally collateral with cells yet) embeded within the internals of the LLMs which are the basic units of such models.

Okay, let's say, such features exist in an LLM, but how do they interact? they standalone won't be much help, now do they? Anthorpic released a paper [6] where they introduced a set of tools to identify such features and how they might be interacting with each other. The attempt was to create something like the wiring diagrams in neuroscience which refers to map connections between neurons showing how they communicate with each other. The tools is called "Attribution Graph" which partially helps understand the chain of intermediate steps that allow a model to transform the input to output.

This paper focused on using this attribution graphs on Oct 24 released Claude-3.5 Haiku.

## Multi Step Reasoning.
- In the experirment, Haiku was prompted, "What is the capital of state containing Dallas?" Now it has to first find the state containing Dallas and then capital of Texas which is Austin. And Haiku did answer that, but did it go through the intermediate steps? or it had just memorized the answer based on it's training data? Previous researches [7] [8] [9] suggests that it did go through the multi-step reasoning.

- To confirm that it did do through the multiti-step reasoning, we need evidence, for this anthropic used Attribution Graphs(AGs). The AGs will describe the features the model used to produce this output.
- And as per the attributions, features related to "Dallas" and with some help of features of "State" invoked the features related to State "Texas".
- Parallely, the features related to "Capital" along with of "State" invoked a feature "Say a Capital"
- And combined the features "Texas" and "Say a capital" made it say "Austin".
- The graph indicates that the replacement model does in fact perform “multi-hop reasoning” – that is, its decision to say Austin hinges on a chain of several intermediate computational steps (Dallas → Texas, and Texas + capital → Austin)
- To extend this experiement and confirm the multi-step reasoning, the experiment was repeated by changing Dallas with other cities like Oakland, which led to (Oakland → California, and California + capital → Sacramento).
- In the next step, Anthropic tried feature injection where instead of the feature "Texas" they added other states like Georgia to see what the outputs will come, so "Say a capital" and "Texas" were on same level, which combined were giving the capital of that state, so when the feature "Georgia" was added, the model was predicing the capital of Georgia -> "Say Atlanta".


## Planning in Rhyming Poems
How do we write the poems that rhyme? No, actually? There are two things that we need to look for 
  - It needs to Rhyme at the ends.
  - It needs to make sense.
To do this, as an overview we can think that this is how the model might be doing this.
  - **Pure Improv** - It writes the first line, and also the second line until the last finishing word, and then it chooses the word that satifies both the constraints we just talked about.
  - **Planning** - Or it can also happen that it plans the ending words of each line first while taking into account the rhyme and content of previous lines and then use this planned word to write the next lines.

Now comes the most important part because LLMs being autoregressors knowing only to predict the next token, the first option seems viable, but the evidence says otherwise.
- It was revealed that the models first activated the features of the candidates for that ending rhyming word even before composing that line instead decided to compose the line after the rhyming word was chosen.
- [10] [11] [12] [13] [14] [15] observed this planned behaviour in LLMs, to extend this Anthropics research tried to add evidence to it, and as mentioned following things were observed.

  - Forward Planning - Choice of the ending word based on previous line(s).
  - Backward Planning - Composing the line prior to that ending word which gives meaning to that ending.
  - Multiple holds - Model has multiple candidates for that ending word in mind.
  - Interesting exp. Apic edited planned ending word and observed whether the model constructed the line based on that.

So as an example, Apic passed the following prompt:
```
A rhyming couplet:⏎ He saw a carrot and had to grab it.⏎
```
now when this input was passed, the ending word of first line, **it** triggered the features that rhymed like rhyming with “eet/it/et” which in turn fired the features like **habit** and **rabit** and most probably because of the word carrot in it, the model chose the word **rabbit**.

- After certain suppressings and injections if features, it was confirmed that **planning features strongly influence final token probabilities.** When interjected, it tried to make sense to that rhyme for that interjected word and when suppressed it tried not to use that word and made sure it still made sense with his remaining candidate ending words.
  
- This choice of ending word occurs at the newline and this ending word affects the intermediate words that assign it the sense. 
1. [SPARSE AUTOENCODERS FIND HIGHLY INTERPRETABLE FEATURES IN LANGUAGE MODELS](https://arxiv.org/pdf/2309.08600)
2. [Towards Monosemanticity: Decomposing Language Models With Dictionary Learning](https://transformer-circuits.pub/2023/monosemantic-features/index.html)
3. [Scaling Monosemanticity: Extracting Interpretable Features from Claude 3 Sonnet](https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html)
4. [Scaling and evaluating sparse autoencoders](https://arxiv.org/pdf/2406.04093)
5. [Transcoders find interpretable LLM feature circuits](http://arxiv.org/pdf/2406.11944.pdf)
6. [Circuit Tracing: Revealing Computational Graphs in Language Models](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)
7. [Do large language models latently perform multi-hop reasoning?](https://arxiv.org/pdf/2402.16837)
8. [Back Attention: Understanding and Enhancing Multi-Hop Reasoning in Large Language Models](https://arxiv.org/pdf/2502.10835)
9. [Hopping too late: Exploring the limitations of large language models on multi-hop queries](https://arxiv.org/pdf/2406.12775)
10. [Planning in a recurrent neural network that plays Sokoban](https://arxiv.org/pdf/2407.15421)
11. [Interpreting Emergent Planning in Model-Free Reinforcement Learning](https://openreview.net/pdf/e8ceadfe0b16829299aebe5ed2c5bcd1e660ba74.pdf)
12. [Evidence of learned look-ahead in a chess-playing neural network](https://proceedings.neurips.cc/paper_files/paper/2024/file/37d9f19150fce07bced2a81fc87d47a6-Paper-Conference.pdf)
13. [Future lens: Anticipating subsequent tokens from a single hidden state](https://arxiv.org/pdf/2311.04897)
14. [Do language models plan ahead for future tokens?](https://arxiv.org/pdf/2404.00859)
15. [ParaScopes: Do Language Models Plan the Upcoming Paragraph?](https://www.lesswrong.com/posts/9NqgYesCutErskdmu/parascope-do-language-models-plan-the-upcoming-paragraph)