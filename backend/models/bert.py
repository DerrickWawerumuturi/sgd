import torch
from transformers import BertTokenizer, BertModel
from models.helper_funcs import aggregate_embeddings, process_song
from models.q_r import song_questions, yes_responses


# Load tokenizer & model once (global initialization)
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertModel.from_pretrained('bert-base-uncased')

def text_to_emb(list_of_text, max_input=512):
    """Convert text list to embeddings"""
    data_token_index = tokenizer.batch_encode_plus(
        list_of_text,
        add_special_tokens=True,
        padding=True,
        truncation=True,
        max_length=max_input,
    )
    
    questions_embeddings = aggregate_embeddings(
        data_token_index['input_ids'],
        data_token_index['attention_mask'],
        model
    )

    return questions_embeddings

# Pre-compute static embeddings for efficiency
embeddings_questions = text_to_emb(song_questions)
embeddings_responses = text_to_emb(yes_responses)

def RAG_QA_cosine(
    query_embeddings, 
    candidate_embeddings, 
    candidate_texts, 
    n_responses=3
):
    """Compute cosine similarity and return top responses"""
    # Compute norms
    query_norms = torch.norm(query_embeddings, dim=1, keepdim=True)
    candidate_norms = torch.norm(candidate_embeddings, dim=1, keepdim=True)
    
    # Dot product & cosine similarity
    cosine_similarity = torch.mm(query_embeddings, candidate_embeddings.T)
    cosine_similarity = cosine_similarity / (query_norms * candidate_norms.T)
    
    # Get top n indices
    sorted_indices = torch.argsort(cosine_similarity.reshape(-1), descending=True).tolist()[:n_responses]
    
    # Return the actual responses instead of printing
    return [candidate_texts[i] for i in sorted_indices]

def predict_song(lyrics, n_responses=3):
    """Process lyrics and return best-matching responses"""
    lyrics = process_song(lyrics)  # clean text
    lyrics_embeddings = text_to_emb(lyrics)
    
    # Get top responses
    top_responses = RAG_QA_cosine(
        lyrics_embeddings,
        embeddings_responses,
        yes_responses,
        n_responses
    )
    
    return top_responses
