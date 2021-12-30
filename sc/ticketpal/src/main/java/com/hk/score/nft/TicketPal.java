package com.hk.score.nft;

import score.*;
import score.annotation.EventLog;
import score.annotation.External;
import score.annotation.Payable;

import java.math.BigInteger;

public class TicketPal extends IRC31Impl {
    private final DictDB<BigInteger, Ticket> tickets = Context.newDictDB("tickets", Ticket.class);
    private int index = 0;
    private final static BigInteger mintFee = BigInteger.valueOf(1000000000000000L);


    @External(readonly=true)
    public String name() {
        return "ticketpal";
    }

    @External
    @Payable
    public void createNFT(String _evn, BigInteger _qtt, String _uri) {
        BigInteger value = Context.getValue();
        BigInteger totalFee = mintFee.multiply(_qtt);
        Context.require(value.compareTo(totalFee) >= 0, "Do not enough fee!");

        Address caller = Context.getCaller();
        for (int i = 0; i < _qtt.intValue(); i++) {
            int slot = (i + 1);
            BigInteger tokenId = BigInteger.valueOf(++index);
            Ticket ticket = new Ticket(caller, _evn, slot);
            tickets.set(tokenId, ticket);
            super._mint(caller, tokenId, BigInteger.ONE);
            String tokenUrl = _uri + "/" + _evn + "/" + slot;
            super._setTokenURI(tokenId, tokenUrl);
            this.MintNewTicket(tokenId, caller, _evn, BigInteger.valueOf(slot));
        }

        //transfer NFT create fee
        Context.transfer(Context.getOrigin(), value);
    }

    @External
    public void setApproval(boolean _approved) {
        super.setApprovalForAll(Context.getAddress(), _approved);
    }

    @External
    public void destroyNFT(BigInteger _id) {
        Context.require(tickets.get(_id) != null, "Invalid token id");

        // burn tokens
        super._burn(Context.getCaller(), _id, BigInteger.ONE);
    }

    @External
    public void setTokenURI(BigInteger _id, String _uri) {
        Context.require(Context.getCaller().equals(tickets.get(_id)), "Not token creator");

        super._setTokenURI(_id, _uri);
    }

    @EventLog(indexed = 2)
    protected void MintNewTicket(BigInteger tokenId, Address creator, String eventName, BigInteger slot) { }
}
