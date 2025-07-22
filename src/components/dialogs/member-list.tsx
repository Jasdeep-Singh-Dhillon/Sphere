'use client';
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

const members = [
    {
        id: 1,
        name: 'krishlavani',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=krishlavani',
        username: 'krishlavani',
        memberSince: '1 month ago',
        joinedDiscord: '5 years ago',
        joinMethod: 'Unknown',
        roles: ['Testing'],
        signals: [],
    },
];

export function MemberListSection() {
    const [search, setSearch] = React.useState('');
    return (
        <div className="max-w-[1200px] mx-auto w-full mt-10">
            <div className="text-2xl font-extrabold text-accent tracking-tight px-12 pt-8 pb-0">
                Server Members
            </div>
            <div className="text-lg font-semibold text-accent px-12 pb-2">Recent Members</div>
            {/* Members Table */}
            <div className="px-12 pb-12">
                <div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-muted-foreground border-b border-accent/10">
                                <th className="py-3 px-2 text-left font-semibold">NAME</th>
                                <th className="py-3 px-2 text-left font-semibold">MEMBER SINCE</th>
                                <th className="py-3 px-2 text-left font-semibold">JOINED DISCORD</th>
                                <th className="py-3 px-2 text-left font-semibold">JOIN METHOD</th>
                                <th className="py-3 px-2 text-left font-semibold">ROLES</th>
                                <th className="py-3 px-2 text-left font-semibold">SIGNALS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members
                                .filter(m => m.name.includes(search) || m.username.includes(search))
                                .map(member => (
                                    <tr
                                        key={member.id}
                                        className="border-b border-accent/10 hover:bg-accent/5 transition"
                                    >
                                        <td className="py-3 px-2 flex items-center gap-3">
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <div className="font-semibold text-white">{member.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {member.username}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-2">{member.memberSince}</td>
                                        <td className="py-3 px-2">{member.joinedDiscord}</td>
                                        <td className="py-3 px-2">{member.joinMethod}</td>
                                        <td className="py-3 px-2">
                                            {member.roles.map(role => (
                                                <span
                                                    key={role}
                                                    className="inline-block bg-muted px-2 py-1 rounded text-xs text-white mr-1"
                                                >
                                                    {role}
                                                </span>
                                            ))}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="ml-1 w-6 h-6 p-0"
                                            >
                                                +
                                            </Button>
                                        </td>
                                        <td className="py-3 px-2">
                                            {/* Signals: plus button for adding signals, like roles */}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="w-6 h-6 p-0"
                                                aria-label="Add Signal"
                                            >
                                                +
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="p-3 text-xs text-muted-foreground">
                        Showing {members.length} member{members.length !== 1 && 's'}
                    </div>
                </div>
            </div>
        </div>
    );
}