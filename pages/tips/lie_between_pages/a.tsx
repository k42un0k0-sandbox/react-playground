import { pagesPath } from "@/lib/$path";
import Liar from "@/pagesComponents/tips/lie_between_pages/Liar";
import Link from "next/link";
export default function A() {
  return (
    <>
      <Liar key={1} />
      <div>dummy</div>
      <Link href={pagesPath.tips.lie_between_pages.b.$url()}>
        <a>b</a>
      </Link>
    </>
  );
}
