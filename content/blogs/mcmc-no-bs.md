---
title: Markov Chain Monte Carlo (MCMC) - No BS
date: April 17, 2025
author: Sujay Kapadnis
---

Have been reading this [article](https://www.jeremykun.com/2015/04/06/markov-chain-monte-carlo-without-all-the-bullshit/) for a while now and it's a great read, thus taking my own notes to understand it better.

### What is Markov Chain Monte Carlo (MCMC)?
- To put it simply, it's a technique to solve problem of random sampling from a complex distribution.
- Imagine I got myself a cat(I love cats), now I want to give it a name, but there are a lot of possibilities like "Oscar", "Lando", "Max", "Lewis" etc. I have a friend who also likes cats and in one shady market he bought a magic box which upon custom settings for me, given a name will return the probabilty of that name being the name of my cat.
- That custom settings is called the distribution specific to my preferences. (Consider that it can't be tempered)
- Since the names are Distinct, D is a Discrete probability distribution and for discrete distributions, we can define a probability mass function (PMF) which is a function that gives the probability of a discrete random variable taking a certain value (in our case, the cat name)
- In reality, these distributions are skewed, where popular names like (lewis, Max) have higher probability than others.
- Now any person would think it is a good idea, keep giving it names and it will give me sort of compatibility of that name that I look for my cats, so after say a few tries, it gives a high probability to the name "Carlos", and since it was customized to me, I'm fairly happy with it.
- You might wonder, what is the problem? and where does MCMC come into picture?
- The problem is I want to draw names from that distribution, but effeciently! Why the current process not efficient? you ask. Well, I don't know what method that magic box uses to give me the probability, can I simulate it? No, I might even get biased towards it, just because I've been told that it will help you decide a good name, so I might start thinking that "Carlos" is a good name, even it might not be, maybe "Kimi" was the perfect name.

Sampling directly from D is hard because:
 - You don’t know the internal process that defines 𝐷 (i.e., how you pick names).
 - 𝐷 is complicated, with potentially many names and uneven probabilities.
 - Direct sampling (e.g., listing all names and their probabilities) is impractical due to the large number of possible names.

Now, let's add one more layer to this to avoid that forced bias, once we get the probability of that name, we'll also carry a biased coin, which we'll flip to decide whether to accept that name or not.

#### Uniform Sampling with a Biased Coin
- Generate a name 𝑥 uniformly at random: Pick a name from the set of all possible names, where each name has an equal chance of being chosen. For example, if there are 10,000 names, each has a 1/10000 chance of being picked.
- Query the magic box for 𝑃(𝑥): Ask the box for the probability 𝑃(𝑥) that you would choose name 𝑥 according to 𝐷.
- Flip a biased coin with probability 
𝑃(𝑥): Use a coin where the probability of landing on heads is 
𝑃(𝑥) If the coin lands heads, accept 𝑥 as your sample. If it lands tails, reject 𝑥 and start over (generate a new name and repeat).

**Why This Setup?**: This is a form of rejection sampling. The coin flip ensures that names with higher 𝑃(𝑥) are more likely to be accepted, so the accepted names follow the distribution 𝐷 However, it’s inefficient.

It's  inefficient because:
**Exponentially many names**: Exponentially many names: There are a vast number of possible names. The variable here is the number of bits needed to write down a name n=∣x∣ refers to the length of a name when encoded as a string (e.g., in a computer or as a sequence of characters).

Problematics Cases: 
 1. Probabilities are exponentially small: If most names have very low probabilities (𝑃(𝑥) is tiny), the coin will rarely land heads, so you’ll reject most names and need many tries to get a sample.
 2. Few names have nonzero probability: If only a few names have significant probabilities, you’ll rarely generate those names randomly, so you’ll need many tries to hit one.

To understand it better, let's take an example:
- Suppose we have a distribution 𝐷 with 1M possible names, and the probability of each name is 1/1000000. 
- And say P(Alex) = 0.05, P(Max) = 0.02 which takes most of the probability mass, the rest of the names have very low probability. even less than 0.000001.
- Now let's be optimistic and say luckily you got the name "Max", the probability we have is 0.02, so only 2% of the time the coin will land heads and you'll accept it. so to get heads at least once, you'll need to try 50 times. You might say, 50 seems managable, right? But it's not that easy is it.
- Only between us, Max comes every 10^6 times. So to reach those 50 tries, you'll need to endure this much sampling.

Now let's get even more granular to the level of bits and computations.
- 1 bit can save 2 values(0 or 1)
- 2 bits can save 4 values(00, 01, 10, 11)
- n bits can save 2^n values

Now when we talk about english characters, we have 26 characters, so we need 5 bits to represent each character. because 4 bits can only represent 16 values, and 5 bits can represent 32 values. so 5 bits will work for us.

and this also means that every character will be represented by 5 bits. such as 
- a = 00000
- b = 00001
- c = 00010....

now let's restric to the hypothesis that the name can be only one character long, like "a", "b", "c" etc. so we restrict the names list to 26 names. so for each name we'll have 5(1) bits. so for name with k characters, we'll have 5k bits.

- allowed 1 charracter names = 26 = 26^1
- allowed 2 character names = 26 * 26 = 26^2
- allowed 3 character names = 26 * 26 * 26 = 26^3
- allowed k character names = 26 * 26 * 26 * 26 = 26^k

so for allowed k characters long names, that earlier 1M now becomes 26^k. I don't even want to do that math for that.

### Random Walks, the "Markov Chain" Part of MCMC
Let's go take some fun part—random walks and how they turn into Markov chains, which are the heart of MCMC. Imagine we’re exploring a map of places, and this map is what we call a directed graph. 

- **What’s a Directed Graph \( G = (V, E) \)?**  
  - Think of it as a map with spots (called **vertices** or **nodes**, written as \( V \)) and one-way roads (called **edges**, written as \( E \)) connecting them.  
  - In our example, the spots are emotional states: Cheerful (1), So-so (2), and Sad (3). The roads show how you can move from one state to another, like going from Cheerful to Sad.  
  - \( G \) isn’t some magic property—it’s a tool we create to model how things (like emotions or names) change. We build it based on the problem we’re solving!

- **What’s a Random Walk?**  
  - It’s like a random stroll on this map. Start at one spot, say Cheerful (1), and decide where to go next using some chances.  
  - From Cheerful, you can:  
    - Stay at Cheerful (1) with a 20% chance (0.2).  
    - Move to So-so (2) with a 30% chance (0.3).  
    - Move to Sad (3) with a 60% chance (0.6).  
  - Pick one randomly based on those chances, then repeat from the new spot. That’s your walk!

- **What Makes it a Markov Chain?**  
  - This random walk becomes a **Markov chain** when the next step only depends on where you are now, not where you’ve been before. Cool, right?  
  - For each road (edge) from spot \( u \) to spot \( v \), we give a probability \( p_{u,v} \) (between 0 and 1).  
  - Rule: The chances of all roads leaving a spot must add up to 1. For Cheerful (1): \( 0.2 + 0.3 + 0.6 = 1 \). This makes sure you always move somewhere!

- **How Does it Work in the Example?**  
  - Start at Cheerful (1). Roll a “probability die” with weights 0.2, 0.3, 0.6. Say you get 0.6, so you move to Sad (3).  
  - From Sad (3), roll again with 0.0 (to Cheerful), 0.7 (to So-so), 0.3 (to Sad). Get 0.7, so move to So-so (2).  
  - Keep going—this is your Markov chain in action!

- **Why Care About This for MCMC?**  
  - For your cat names, we can use a similar map where spots are names, and roads connect “similar” names (e.g., “Max” to “Maxi”). The probabilities \( p_{u,v} \) help us jump around to find names matching your distribution \( D \).  
  - Over a long walk, you’ll spend more time at names you like, which is the goal of MCMC!

- **Stationary Distribution (The Cool Part)**  
  - After lots of steps, the chance of being at any spot (like Cheerful) settles into a steady pattern, no matter where you started.  
  - This pattern is the **stationary distribution**—it’s like finding the “natural” mix of emotions or names you’d pick!

- **One Catch**  
  - The walk only works if every spot has a way out (some maps have dead ends). We might need to tweak the map, but the idea of random walking is solid!

