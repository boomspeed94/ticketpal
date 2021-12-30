package com.hk.score.nft;

import score.Address;
import score.ObjectReader;
import score.ObjectWriter;

public class Ticket {
    Address creator;
    String eventName;
    int slot;

    public Ticket() {}

    public Ticket(Address creator, String eventName, int slot) {
        this.creator = creator;
        this.eventName = eventName;
        this.slot = slot;
    }

    public static void writeObject(ObjectWriter w, Ticket ticket) {
        w.beginList(3);
        w.write(ticket.creator);
        w.write(ticket.eventName);
        w.write(ticket.slot);
        w.end();
    }

    public static Ticket readObject(ObjectReader r) {
        Ticket ticket = new Ticket();
        r.beginList();
        ticket.creator = r.readAddress();
        ticket.eventName = r.readString();
        ticket.slot = r.readInt();
        r.end();
        return ticket;
    }
}
