import Liar from "@/pagesComponents/tips/lie_between_pages/Liar";
import { pagesPath } from "@/lib/$path";
import Link from "next/link";
export default function B() {
  return (
    <>
      <Liar key={1} />
      <Link href={pagesPath.tips.lie_between_pages.a.$url()}>
        <a>a</a>
      </Link>
    </>
  );
}
