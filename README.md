# UTSA AI Academic Advisor

This application takes into consideration all of UTSA's undergraduate course catalog, and enables students to easily ask any sort of question on what programs are available, course details, and even get recommendations based on their interests or needs.

# Unlimited Context vs RAG

`TLDR; Utilizing long context 100k-1m tokens results in 30s-60s responses which make poor chat experiences. Probably only useful for asynch processing`

There are some misconceptions on increasing context lengths and the use of retrieval in AI applications.  Since it's beginning there have been opinions on RAG around it being a bad solution, it is only a temporary practice, with little to no superior methods for increasing the knowledge of AI applications. Now with some models having context lengths upwards of 1 million tokens and quite a few models having 100k+, people are returning to say that these increases will result in RAG practices being useless.  

## 1 Million Tokens

To start, for anyone who has built applications with retrieval and also built applications with extremely large context lengths, it's clear that they both have their use cases but retrieval is not going away and will likely not anytime soon.  For instance, in this application that uses Gemini 1.5 Pro with 1 million token length, responses are extremely slow.  Increasing token limits does not change the fact that all of those tokens still have to be processed.

## Speed

In a lot of AI applications that use retrieval, chat experiences are very smooth because of sub 1 second time to first token and token generation near or faster than typical reading speed.  So sure you can pass in 900k tokens without needing retrieval but now you are processing 900k input tokens at some max speed leading to 30s-60s response times for simple questions.

## Comparisons

So the question now is when to use one or the other or both.  At this point it is unlikely that you would have some application that would need 1 million context length without first implementing retrieval.  If a user question can be used in some way to trim down the input by only getting the required sections of a knowledge base, use it.  The only times you might truly want to utilize the full large context is if you absolutely cannot remove any of the input documents, maybe because you don't actually know what you're looking for.  In this case it might be useful to simply pass in the entire documents, wait for the long response time, and have the model comb through all 900k tokens.
