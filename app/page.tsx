"use client";
import useAuth from "@/utils/authProvider";
import Image from "next/image";
import { redirect, } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
   redirect("/login")
   return <div className=""></div>;
}
